# Verify Existing Data While Importing

## Implementation Plan

### Phase 1: Backend - Add Verify Endpoint + Update Import Logic  ✅
- [x] 1. Update `server/controllers/transactionController.js` - Add verifyImport + update importTransactions with skipDuplicates
- [x] 2. Update `server/controllers/table2Controller.js` - Same
- [x] 3. Update `server/controllers/table3Controller.js` - Same
- [x] 4. Update `server/controllers/table4Controller.js` - Same
- [x] 5. Update `server/controllers/table5controller.js` - Same
- [x] 6. Add `POST /verify-import` route to all route files

### Phase 2: Frontend - Add Verify Thunks + Update Import Thunks  ✅
- [x] 7. Update `transactionSlice.js` - Add verifyImport thunk, update importTransactions payload
- [x] 8. Update `table2Slice.js` - Same
- [x] 9. Update `table3Slice.js` - Same
- [x] 10. Update `table4Slice.js` - Same
- [x] 11. Update `table5Slice.js` - Same

### Phase 3: Frontend - Update ImportModal.jsx  ✅
- [x] 12. Update `ImportModal.jsx` - Add verify step after parsing, duplicate warnings UI, row highlighting, skipDuplicates option

