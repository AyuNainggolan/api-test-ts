@api @pet
Feature: Scenario to udate pet information

  @positive-case
  Scenario:  UPDATE Pet Information
    Given a valid headers with authentication
    When client sends a GET request to "/pet/2"
    Then response status should be "200"
    And response should have "$.name" matching "kurikuri"
    And response should have "$.category.name" matching "Pomeranian"
    When client update the Pet information for pet ID "2"
    Then response status should be "200"
    And response should have "$.tags[0].name" matching "Super Cute"
