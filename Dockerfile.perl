# Use an official Perl runtime as a parent image
FROM perl:latest AS final_image

# Set the working directory to /app
WORKDIR /perl_app

# Copy the current directory contents into the container at /app
COPY /perl_app /perl_app

# Install any needed packages specified in requirements.txt
RUN     apt-get update \
    &&  apt-get install -y libmariadb-dev-compat libmariadb-dev \
    # For some reason, not providing the version for DBD::mysql does not work. This version worked locally.
    &&  cpanm Mojolicious Mojolicious::Plugin::CORS DBI JSON Try::Tiny Config::Simple DBD::mysql@4.050

FROM final_image

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app.pl when the container launches
CMD ["morbo", "-l", "http://*:3000","app.pl"]
# CMD ["/usr/bin/sleep", "infinity"]