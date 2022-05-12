package com.pms.pensionerdetail.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class AuthenticationRequest implements Serializable {

	private String username;
	private String password;

	public AuthenticationRequest() {
	}

	public AuthenticationRequest(String username, String password) {
		this.setUsername(username);
		this.setPassword(password);
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}