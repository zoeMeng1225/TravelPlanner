package travelplanner.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import travelplanner.model.BaseResponse;
import travelplanner.model.entity.User;
import travelplanner.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class AuthController {

    @Autowired
    private UserService userService;

//    @RequestMapping(value = "/user/registration", method = RequestMethod.GET)
//    public ModelAndView getRegistrationForm(){
//        User user = new User();
//        return new ModelAndView("register", "user", user);
//    }

    @PostMapping(value = "/registration")
    @ResponseBody
    public BaseResponse<String> registerUser(@RequestBody User user) {
        try{
            if (userService.getUserByUserName(user.getUsername()) == null){
                userService.addUser(user);
                return new BaseResponse<>("200", null, "Registration succeeded");}
            else{
                return new BaseResponse<>("409", null, "User already exists");}}
        catch (Exception e){
            e.printStackTrace();
            return new BaseResponse<>("500", null, e.getMessage());
        }
    }

    @RequestMapping("/login")
    @ResponseBody
    public BaseResponse<String> login(@RequestParam(value = "error", required = false) String error,
                                      @RequestParam(value = "logout", required = false) String logout) {
        System.out.println(error);
        if (error != null) {
            return new BaseResponse<>("400", null, "Invalid username or password");
        }

        if (logout != null) {
            return new BaseResponse<>("200", null, "logout succeed");
        }
        return new BaseResponse<> ("200", null, "login succeed");
    }
}


