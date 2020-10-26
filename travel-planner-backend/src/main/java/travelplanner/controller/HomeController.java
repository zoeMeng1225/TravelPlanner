package travelplanner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import travelplanner.model.BaseResponse;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class HomeController {
    @GetMapping("/")
    public void home() {}
}
