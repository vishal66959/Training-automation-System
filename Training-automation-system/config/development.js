const clientId =
  "707145768238-213cgj5kt3rddje1mbmsuasr4setp8kb.apps.googleusercontent.com";
const clientKey = "c5adCGXxYhIACtAclf59G_3I";
const scope =
  "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.send+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile";
const redirectUri = "http://localhost:3000/login/gmail";

module.exports = {
  name: "Training App",
  port: process.env.PORT || 3000,
  clientId,
  clientKey,
  scope,
  redirectUri: redirectUri,
  url:
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
    clientId +
    "&response_type=code&scope=" +
    scope +
    "&redirect_uri=" +
    redirectUri +
    "&access_type=offline",
  loglevel: "info",
  authLink: "https://www.googleapis.com/oauth2/v4/token",
  tokenLink: "https://www.googleapis.com/plus/v1/people/me?access_token=",
  password :''
};
