# Use an official Perl runtime as a parent image
FROM perl:latest

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY /perl_app /app

# Install any needed packages specified in requirements.txt
RUN cpanm Dancer2 DBI Config::Simple Mojolicious

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run app.pl when the container launches
CMD ["perl", "app.pl"]
