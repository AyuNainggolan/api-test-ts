@api @pet
Feature: Scenario to Place Pet Order

  @positive-case
  Scenario:  Create Pet Order
    Given a valid headers with authentication
    When client sends a GET request to "/pet/12"
    Then response status should be "200"
    And response should have "$.name" matching "pupo"
    And response should have "$.category.name" matching "pajaro"
    And client sets the value of "points_to_earn" as "2" on body parameter
    And response json should match with json schema "pet/get/pet-information"
    And client collects data "id" from body parameters
    And client place an order with path ID "12"
    Then response status should be "200"
    And response json should match with json schema "pet/post/place-order"
    And response should have "$.petId" matching "12"
    And response should have "$.status" matching "placed"

