package naver.cloud;

import org.springframework.web.multipart.MultipartFile;

public interface ObjectStorageService {
	public String uploadFile(String bucketName,String directoryPath,MultipartFile file);
	public boolean deleteFile(String bucketName,String directoryPath,String fileName);
}