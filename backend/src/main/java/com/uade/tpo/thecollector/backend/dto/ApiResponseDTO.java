package com.uade.tpo.thecollector.backend.dto;

import java.time.LocalDateTime;

public class ApiResponseDTO<T> {

	private int status;
	private String message;
	private T data;
	private LocalDateTime timestamp;

	public ApiResponseDTO() {
	}

	public ApiResponseDTO(int status, String message, T data, LocalDateTime timestamp) {
		this.status = status;
		this.message = message;
		this.data = data;
		this.timestamp = timestamp;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}
