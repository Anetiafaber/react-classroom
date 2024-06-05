# Clone the github repo
git clone https://github.com/Anetiafaber/react-classroom.git

# Install dependencies
npm install

# Create a config folder in the parent directory and add a file called database.config.js

# Add your mongodb connection string
module.exports = {
    url: '<connection string>'
}

# Start application
node server.js
