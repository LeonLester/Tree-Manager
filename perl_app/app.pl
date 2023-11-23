# app.pl
use Dancer2;
use DBI;
use strict;
use warnings;

# Load environment variables from the .env file
use Config::Simple;
my $config = new Config::Simple('.env');

# Access individual environment variables
my $host = $config->param("MYSQL_HOST");
my $user = $config->param("MYSQL_USER");
my $password = $config->param("MYSQL_PASSWORD");
my $database = $config->param("MYSQL_DATABASE");

print("$host, $user, $password, $database aaa");
# Database connection
my $dbh = DBI->connect("DBI:mysql:database=$database;host=$host", $user, $password, { RaiseError => 1, AutoCommit => 1});
print($dbh);
# Route to fetch the tree data
get '/api/nodes' => sub {
    # Code for fetching nodes from database
};

# Route to add a node 
post '/api/nodes' => sub {
    # Code for adding a node to the database
};

# Route to clear the whole tree
post '/api/nodes/truncate' => sub {
    # Code for truncating the table
};

# Helper functions
sub transform_data {
    # Code for transforming data
}

sub build_tree {
    # Code for building a tree
}

# Start the application
start;