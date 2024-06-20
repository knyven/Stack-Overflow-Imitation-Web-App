import React, { useState } from "react";
import PropTypes from "prop-types";

function RegistrationForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onRegister({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    setIsRegistered(success); // Set registration status based on the result of onRegister
    if (!success) {
      setErrorMessage("Registration failed"); // Set error message if registration failed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
      {isRegistered && <p className="success-message">Registration successful!</p>} {/* New success message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* New error message */}
    </form>
  );
}

RegistrationForm.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default RegistrationForm;
