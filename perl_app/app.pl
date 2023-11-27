# app.pl
use strict;
use warnings;
use Mojolicious::Lite;
use DBI;
use JSON;
use Try::Tiny;
use Config::Simple;
use Mojolicious::Plugin::CORS;
use DBD::mysql;
# Enable CORS for all routes
plugin 'CORS' => {
    origin => '*',
    methods => 'GET,POST,PUT,DELETE,OPTIONS',
    max_age => 86400,
    debug => 1,  # Enable debugging
};
# Load environment variables from the .env file
my $config = Config::Simple->new('.env');

# Access individual environment variables
my $host = $config->param("MYSQL_HOST");
my $user = $config->param("MYSQL_USER");
my $password = $config->param("MYSQL_PASSWORD");
my $database = $config->param("MYSQL_DATABASE");
my $db_port = $config->param("MYSQL_PORT");
# Database connection

# Database connection helper
helper db => sub {
    state $dbh = DBI->connect(
        "DBI:mysql:database=$database;host=$host;port=$db_port;",
        $user,
        $password,
        {
            RaiseError => 1,
            AutoCommit => 1,
        }
    );
};

# Route to fetch the tree data
get '/api/nodes' => sub {
    my $c = shift;

    try {
        my $nodes = get_nodes_from_database();
        my $tree_data = transform_data($nodes);
        $c->render(json => $tree_data);
    }
    catch {
        my $error = $_;
        app->log->error("Error fetching tree data: $error");
        $c->render(json => { error => 'Failed to fetch tree data' }, status => 500);
    };
};

sub get_nodes_from_database {
    my $sth = app->db->prepare('SELECT * FROM Node');
    $sth->execute();
    my $nodes = $sth->fetchall_arrayref({}); # fetchall_arrayref returns an arrayref of hashrefs
    return $nodes;
}

options '/api/nodes' => sub {
    my $c = shift;
    $c->render(text => '', status => 204);
};

# Route to add a node
post '/api/nodes' => sub {
    my $c = shift;
        app->log->debug("aaa");
    try {
        my $data      = $c->req->json;
        my $id        = $data->{ID};
        my $parent_ID = $data->{parent_ID};

        my $dbh = $c->app->db;

        my ( $query, @values );

        if ($id) {
            $query  = 'INSERT INTO Node (ID) VALUES (?)';
            @values = ($id);
        }
        elsif ($parent_ID) {
            $query  = 'INSERT INTO Node (parent_ID) VALUES (?)';
            @values = ($parent_ID);
        }
        else {
            return $c->render( json => { error => 'Either ID or parent_ID must be provided' }, status => 400 );
        }

        my $insert_sth = $dbh->prepare($query);
        $insert_sth->execute(@values);

        # Fetch the inserted node for response
        my $select_sth = $dbh->prepare('SELECT * FROM Node WHERE ID = LAST_INSERT_ID()');
        $select_sth->execute;
        my $new_node = $select_sth->fetchrow_hashref;

        return $c->render( json => $new_node, status => 200 );
    }
    catch {
        my $error_message = $_;

        # Check specific MySQL error codes and provide custom error messages
        if ( $error_message =~ /foreign key constraint fails/i ) {
            return $c->render( json => { error => 'Parent node does not exist' }, status => 400 );
        }
        else {
            return $c->render( json => { error => 'Failed to add node. Database error' }, status => 500 );
        }
    };
};

# Route to clear the whole tree
post '/api/nodes/truncate' => sub {
    my $c = shift;

    try {
        my $dbh = $c->app->db;

        # Truncate the Node table
        my $truncate_sth = $dbh->prepare('TRUNCATE TABLE Node');
        $truncate_sth->execute;

        return $c->render(json => { message => 'Table Node truncated successfully' }, status => 200);
    }
    catch {
        my $error_message = $_;
        app->log->error("Error truncating table: $error_message");
        return $c->render(json => { error => 'Failed to truncate table' }, status => 500);
    };
};


app->start;

# Helper function to transform database rows into tree structure
sub transform_data {
    my ($rows) = @_;
    my @nodes = map { { 'id' => $_->{'ID'}, 'name' => "Node $_->{'ID'}", 'parent_id' => $_->{'parent_ID'} } } @{$rows};
    my $tree = build_tree(\@nodes);
    return $tree;
}

# Helper function to build a tree from a flat list
sub build_tree {
    my ($nodes) = @_;
    my %tree_map = map { $_->{'id'} => { '_node' => $_, 'children' => [] } } @{$nodes};
    my @root_nodes;

    for my $node_info (values %tree_map) {
        my $parent_id = $node_info->{'_node'}->{'parent_id'};
        if (!defined $parent_id) {
            push @root_nodes, $node_info;
        } else {
            my $parent_info = $tree_map{$parent_id};
            push @{$parent_info->{'children'}}, $node_info;
        }
    }

    # Sort children nodes in ascending numerical order
    for my $node_info (values %tree_map) {
        @{$node_info->{'children'}} = sort { $a->{'_node'}->{'id'} <=> $b->{'_node'}->{'id'} } @{$node_info->{'children'}};
    }

    # Sort root nodes in ascending numerical order
    @root_nodes = sort { $a->{'_node'}->{'id'} <=> $b->{'_node'}->{'id'} } @root_nodes;

    return \@root_nodes;
}
