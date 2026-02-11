# User Stories — Race Pace Calculator

## US-01: Calculate Time from Distance and Pace

**As a** runner  
**I want to** select a race distance and enter my target pace  
**So that** I can see how long the race will take me

### Acceptance Criteria

```gherkin
Feature: Calculate finish time

  Scenario: Preset distance with pace
    Given I am on the calculator page
    When I select "5K" as the distance
    And I enter "05:00" as the pace
    And I click "Calculate"
    Then I should see "00:25:00" as the result

  Scenario: Marathon finish time
    Given I am on the calculator page
    When I select "Marathon" as the distance
    And I enter "05:41" as the pace
    And I click "Calculate"
    Then I should see approximately "04:00:00" as the result

  Scenario: Custom distance
    Given I am on the calculator page
    When I click "Custom"
    And I enter "7.5" as the distance
    And I enter "06:00" as the pace
    And I click "Calculate"
    Then I should see "00:45:00" as the result
```

---

## US-02: Calculate Pace from Distance and Time

**As a** runner  
**I want to** enter a race distance and my target finish time  
**So that** I can see what pace I need to maintain

### Acceptance Criteria

```gherkin
Feature: Calculate pace

  Scenario: 10K pace calculation
    Given I am on the calculator page
    When I select "10K" as the distance
    And I enter "00:50:00" as the time
    And I click "Calculate"
    Then I should see "05:00 min/km" as the result

  Scenario: Half marathon pace
    Given I am on the calculator page
    When I select "Half Marathon" as the distance
    And I enter "01:45:00" as the time
    And I click "Calculate"
    Then I should see approximately "04:58 min/km" as the result
```

---

## US-03: Calculate Distance from Pace and Time

**As a** runner  
**I want to** enter my pace and running time  
**So that** I can see how far I ran or will run

### Acceptance Criteria

```gherkin
Feature: Calculate distance

  Scenario: Distance from pace and time
    Given I am on the calculator page
    When I enter "05:00" as the pace
    And I enter "00:25:00" as the time
    And I click "Calculate"
    Then I should see "5.00 km" as the result
```

---

## US-04: Switch Between Metric and Imperial Units

**As a** runner  
**I want to** toggle between kilometers and miles  
**So that** I can see calculations in my preferred unit system

### Acceptance Criteria

```gherkin
Feature: Unit system toggle

  Scenario: Switch to imperial
    Given I am on the calculator page in metric mode
    When I click "Imperial (mi)"
    Then distances should be displayed in miles
    And pace should be displayed as min/mi

  Scenario: Convert distance on toggle
    Given I have selected "5K" in metric mode
    When I switch to imperial
    Then the distance field should show approximately "3.11"
    And the unit label should change to "mi"

  Scenario: Switch back to metric
    Given I am in imperial mode
    When I click "Metric (km)"
    Then distances should be displayed in kilometers
    And pace should be displayed as min/km
```

---

## US-05: View Split/Interval Times

**As a** runner  
**I want to** see projected split times at configurable intervals  
**So that** I can plan my pacing strategy during a race

### Acceptance Criteria

```gherkin
Feature: Split times table

  Scenario: 5K with 1km splits
    Given I am on the splits page
    When I select "5K" as the distance
    And I enter "05:00" as the pace
    And the interval is set to "1" km
    And I click "Generate Splits"
    Then I should see a table with 5 rows
    And each split time should be "00:05:00"
    And the cumulative time for row 5 should be "00:25:00"

  Scenario: 10K with custom 2.5km interval
    Given I am on the splits page
    When I select "10K" as the distance
    And I enter "05:00" as the pace
    And I set the interval to "2.5" km
    And I click "Generate Splits"
    Then I should see a table with 4 rows

  Scenario: Half marathon with remainder split
    Given I am on the splits page
    When I select "Half Marathon" as the distance
    And I enter "05:00" as the pace
    And the interval is set to "5" km
    And I click "Generate Splits"
    Then I should see 5 rows (4 full + 1 remainder)
    And the last row distance should be "21.10"
```

---

## US-06: Switch Language (English / French)

**As a** user  
**I want to** switch the interface language between English and French  
**So that** I can use the app in my preferred language

### Acceptance Criteria

```gherkin
Feature: Internationalization

  Scenario: View in English
    Given I navigate to "/en"
    Then the title should be "Race Pace Calculator"
    And the button should say "Calculate"

  Scenario: View in French
    Given I navigate to "/fr"
    Then the title should be "Calculateur d'Allure"
    And the button should say "Calculer"

  Scenario: Switch language via menu
    Given I am on "/en"
    When I open the language menu
    And I select "Français"
    Then the URL should change to "/fr"
    And the interface should be in French

  Scenario: Maintain language on navigation
    Given I am on "/fr"
    When I navigate to the splits page
    Then I should see "Temps de Passage" as the title
    And the URL should contain "/fr/splits"
```

---

## US-07: Toggle Dark/Light Theme

**As a** user  
**I want to** switch between light and dark themes  
**So that** I can use the app comfortably in any lighting condition

### Acceptance Criteria

```gherkin
Feature: Theme switching

  Scenario: Enable dark mode
    Given I am on the calculator page
    When I open the theme menu
    And I select "Dark"
    Then the page should use a dark color scheme

  Scenario: Enable light mode
    Given I am in dark mode
    When I open the theme menu
    And I select "Light"
    Then the page should use a light color scheme

  Scenario: System theme
    Given I am on the calculator page
    When I open the theme menu
    And I select "System"
    Then the theme should match my OS preference
```

---

## US-08: Responsive Mobile Layout

**As a** mobile user  
**I want to** use the calculator on my phone  
**So that** I can calculate race paces on the go

### Acceptance Criteria

```gherkin
Feature: Mobile responsive design

  Scenario: Mobile navigation
    Given I am on a mobile device (< 768px)
    Then the desktop navigation links should be hidden
    And a hamburger menu button should be visible

  Scenario: Open mobile menu
    Given I am on a mobile device
    When I tap the hamburger menu
    Then I should see links to "Calculator" and "Splits"

  Scenario: Navigate via mobile menu
    Given the mobile menu is open
    When I tap "Splits"
    Then I should be taken to the splits page
    And the mobile menu should close
```

---

## US-09: Input Validation

**As a** user  
**I want to** receive clear error messages for invalid input  
**So that** I know what to fix

### Acceptance Criteria

```gherkin
Feature: Input validation

  Scenario: Missing fields
    Given I am on the calculator page
    When I only fill in one field
    And I click "Calculate"
    Then I should see "Please fill in at least two fields."

  Scenario: Reset form
    Given I have filled in some fields
    When I click "Reset"
    Then all fields should be cleared
    And the result should be hidden
```

---

## US-10: Select Preset Distances

**As a** runner  
**I want to** quickly select common race distances  
**So that** I don't have to type the distance manually

### Acceptance Criteria

```gherkin
Feature: Preset distance selection

  Scenario: Available presets
    Given I am on the calculator or splits page
    Then I should see buttons for: 5K, 10K, 15K, Half Marathon, Marathon, Ultra 50K, Ultra 100K, Custom

  Scenario: Select preset
    When I click "Half Marathon"
    Then the distance field should show "21.10" (metric) or "13.11" (imperial)

  Scenario: Custom distance
    When I click "Custom"
    Then the distance field should be editable
    And I can type a decimal value like "13.1"
```
