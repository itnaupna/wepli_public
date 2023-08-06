package com.bit.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class YoutubeSearchService {

    public List<Map<String,String>> getYoutubeResult(String id) {

        String url = "https://youtube.com/results?search_query=" + id;
        try {
            URL youtubeURL = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) youtubeURL.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                // Now, you can process the response (source code) as needed
                String html = response.toString();
                // Add your parsing logic here to extract relevant information from the HTML
                // source
                // For parsing, you may use libraries like Jsoup or Jackson

                // Example: Print(Map<String,Object>) the source code
                ObjectMapper objectMapper = new ObjectMapper();
                TypeReference<Map<String, Object>> tr = new TypeReference<Map<String, Object>>() {
                };
                String jStr = html.split("var ytInitialData = ")[1].split(";</script>")[0];

                Map<String, Object> rm = objectMapper.readValue(jStr, tr);
                List<Map<String, Object>> lst = ((Map<String, List<Map<String, Map<String, List<Map<String, Object>>>>>>) ((Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) rm
                        .get("contents")).get("twoColumnSearchResultsRenderer")).get("primaryContents"))
                        .get("sectionListRenderer")).get("contents").get(0).get("itemSectionRenderer").get("contents");

                List<Map<String,String>> result = new ArrayList<Map<String,String>>();

                for (Map<String, Object> map : lst) {
                    Map<String,Object> p = (Map<String,Object>) map.get("videoRenderer");
                    if (p == null)
                        continue;
                        

                    Map<String,String> data = new HashMap<>();
                    data.put("id", (String)p.get("videoId"));
                    data.put("img",((List<Map<String,String>>)((Map<String,Map<String,Object>>)p.get("thumbnail")).get("thumbnails")).get(0).get("url").split("\\?")[0]);
                    data.put("title",((Map<String,List<Map<String,String>>>)p.get("title")).get("runs").get(0).get("text"));
                    data.put("author",((Map<String,List<Map<String,String>>>)p.get("ownerText")).get("runs").get(0).get("text"));
                    data.put("length",((Map<String,String>)p.get("lengthText")).get("simpleText"));

                    result.add(data);
                }
                return result;
                // System.out.println(html);
            } else {
                System.out.println("Failed to fetch data. Response Code: " + responseCode);
                return null;
            }

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

}
