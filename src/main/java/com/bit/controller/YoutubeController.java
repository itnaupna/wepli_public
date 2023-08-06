package com.bit.controller;


import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bit.service.YoutubeSearchService;

@RestController
@RequestMapping("/api")
public class YoutubeController {
    @GetMapping("/lv1/y/search")
    public List<Map<String,String>> search(String query){
        YoutubeSearchService youtubeResult = new YoutubeSearchService();
		try {
			return youtubeResult.getYoutubeResult(URLEncoder.encode(query,"UTF-8"));
		} catch (UnsupportedEncodingException e) {
            return null;
		}
    }    
}
