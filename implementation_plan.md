# Fix Health Functionality in Tafeltoren

The goal is to fix the health system in `tafel.js` so it correctly penalizes the player for wrong answers and timeouts, and provides a proper "Game Over" state.

## User Feedback Required

> [!IMPORTANT]
> I will be adding a penalty where health decreases by 1 if the timer runs out.
> I will also implement a "Game Over" state that stops the game when health reaches 0. I will show a "Game Over" message in the feedback area and disable further inputs.

## Proposed Changes

### JavaScript

#### [MODIFY] [tafel.js](file:///c:/Users/daana/OneDrive%20-%20ROC%20Alfa-college/Schooljaar%201%20Daan/Module%205/Project/projectmap/Project%20Module%205/Module%205/Opdracht%20Serious%20Web%20Game/Tafeltoren/js/tafel.js)
- Create a `updateHealthUI()` function to keep the heart display in sync.
- Update `tijdIsOp()` to decrease health and update UI.
- Fix `controleerAntwoord()` to use `updateHealthUI()`.
- Improve the "Game Over" check to disable inputs and show a clear message.
- Prevent `volgendeVraag()` from starting if health is 0.

## Open Questions

- Should health be reset at each level, or carry over? (Currently it carries over).
- Do you want an overlay/pop-up when Game Over occurs, or just text on the screen?

## Verification Plan

### Manual Verification
- Play the game and intentionally get answers wrong to see health decrease.
- Let the timer run out to see health decrease.
- Reach 0 health and verify the game stops/shows Game Over.
