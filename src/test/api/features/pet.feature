@api @pet
Feature: Scenario to get pet information

  @positive-case
  Scenario:  GET Pet Information
    Given a valid headers with authentication
    When client sends a GET request to "/pet/1"
    Then response status should be "200"
    And response json should match with json schema "pet/get/pet-information"

  @negative-case
  Scenario: GET Pet Information with invalid Pet ID
    Given a valid headers with authentication
    When client sends a GET request to "/pet/1xxxxxx"
    Then response status should be "400"
    And response should have "$.message" matching "Invalid Pet ID" 
  
  @negative-case
  Scenario: GET Pet Information with Pet not found
    Given a valid headers with authentication
    When client sends a GET request to "/pet/112345"
    Then response status should be "404"
    And response should have "$.message" matching "Pet not found" 
