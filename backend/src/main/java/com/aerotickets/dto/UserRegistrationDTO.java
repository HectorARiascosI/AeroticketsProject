package com.aerotickets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRegistrationDTO {

  @NotBlank @Size(min = 3, max = 80)
  private String fullName;

  @NotBlank @Email
  private String email;

  @NotBlank @Size(min = 8, max = 120)
  private String password;

  // getters/setters
  public String getFullName() { return fullName; }
  public void setFullName(String fullName) { this.fullName = fullName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
}