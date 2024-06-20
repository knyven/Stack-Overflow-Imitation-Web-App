const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

exports.loginUser = async (req, res) => {
  console.log("Request Body:", req.body);

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).select('+reputation'); // Fetch reputation along with user details
    console.log("Found User:", user);

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    console.log("Comparing passwords: ", {
      provided: password,
      stored: user.password,
    });
    const isMatch = await bcrypt.compareSync(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;

        res.cookie("token", token, {
          httpOnly: true,
          // eslint-disable-next-line no-undef
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600 * 1000,
        });

        // Include user ID, username, and reputation in the response
        res.status(200).json({
          user: {
            id: user.id,
            username: user.username,
            email:user.email,
            reputation: user.reputation // Include reputation in the response

          },
          msg: "Login successful",
        });
      }
    );
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).send(error);
  }
};
