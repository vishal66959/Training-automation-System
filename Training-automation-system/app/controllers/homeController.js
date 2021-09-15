import Responder from "../../lib/expressResponder";
export default class HomeController {
  static home(req, res) {
    Responder.render(res,"home");
  }
}
