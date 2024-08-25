# Slackr - Vanilla JS Chat Application

This project is a simplified clone of Slack, named "Slackr", built entirely in Vanilla JavaScript. It includes features such as user registration, login, channel creation, and basic messaging functionalities.

## Features

### User Authentication
- **Registration**: Users can create a new account by providing their email, name, and password.
- **Login**: Users can log in using their registered email and password.

### Channels
- **Creating Channels**: Users can create public or private channels, providing a name and optional description.
- **Viewing Channels**: Users can view a list of all public channels and the private channels they are members of.
- **Channel Details**: Users can view details of channels they are part of, and edit details if they are the channel creator.

### Messaging
- **View Messages**: Users can view messages within a channel.
- **Send Messages**: Users can send new messages to a channel.
- **Edit and Delete Messages**: Users can edit or delete their own messages.

### User Profile
- **View and Edit Profile**: Users can view and edit their profile information including changing their password and updating their profile picture.

## Getting Started

### Prerequisites
- A modern web browser that supports ES6+ (e.g., Chrome, Firefox)
- Node.js installed on your machine

### Local Development

1. Clone the repository to your local machine:
   ```sh
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```sh
   cd slackr
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Install dependencies:
   ```sh
   cd backend
   npm start
   ```

5. Run the frontend using a simple HTTP server:
   ```sh
	cd ../frontend
	npx http-server -p 8000
   ```

6. Open your web browser and visit http://localhost:8000 to view the application.


## Contribution
Feel free to fork this project and make your own changes. Pull requests are welcome for bug fixes, improvements, and adding new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
This project was inspired by the Slack application and aims to provide basic features using Vanilla JavaScript and minimal external libraries.