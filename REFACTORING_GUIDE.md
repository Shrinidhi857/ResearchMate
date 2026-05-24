# ProjectPage Refactoring - File Structure Documentation

## Overview

The original `ProjectPage.tsx` (1346 lines) has been refactored into a modular structure with separated components, hooks, and utilities.

## New Folder Structure

```
src/
├── components/
│   └── project/
│       ├── MessageBubble.tsx
│       ├── ProjectHeader.tsx
│       ├── CollaboratorDialog.tsx
│       ├── UserAvatarStack.tsx
│       └── LaTeXEditor/
│           ├── index.tsx (Main LaTeX Editor Component)
│           ├── types.ts (TypeScript interfaces)
│           ├── components/
│           │   ├── EditorHeader.tsx
│           │   ├── AgentStatusBar.tsx
│           │   ├── CodeTab.tsx
│           │   ├── PreviewTab.tsx
│           │   ├── HistoryTab.tsx
│           │   └── AgentTab.tsx
│           └── hooks/
│               ├── useLatexCompilation.ts
│               ├── useLatexEditorState.ts
│               ├── useLatexHistory.ts
│               └── useAgentConnection.ts
├── hooks/
│   └── project/
│       ├── useProjectMessages.ts
│       ├── useProjectDetails.ts
│       └── useProjectUsers.ts
└── pages/
    ├── ProjectPage.tsx (Original - Keep or replace with refactored)
    └── ProjectPage-refactored.tsx (New refactored version)
```

## Migration Steps

### 1. Replace ProjectPage.tsx

The refactored version is significantly smaller (~150 lines vs 1346 lines) and easier to maintain.

**Option A: Direct Replacement**

```bash
# Backup the original
cp src/pages/ProjectPage.tsx src/pages/ProjectPage.backup.tsx

# Replace with refactored version
cp src/pages/ProjectPage-refactored.tsx src/pages/ProjectPage.tsx
```

**Option B: Gradual Migration**

- Keep both files initially
- Test the refactored version in a feature branch
- Replace when confident

### 2. Key Components

#### `MessageBubble.tsx`

- Simple component for displaying chat messages
- Handles outgoing vs incoming styling

#### `LaTeXEditor/index.tsx`

- Main LaTeX editor with tabs: Code, Preview, History, Agent
- Integrates all LaTeX-related hooks
- Manages WebSocket connection to LaTeX Agent
- Handles PDF download

#### `ProjectHeader.tsx`

- Editable project title
- Consistent with original UI

#### `UserAvatarStack.tsx`

- Displays collaborator avatars
- Shows user info on hover

### 3. Key Hooks

#### `useLatexCompilation.ts`

- Handles LaTeX code compilation
- Loads LaTeX.js library
- Manages error handling
- Returns: compiledHTML, compileLatex function, compilation state

#### `useLatexEditorState.ts`

- Centralizes LaTeX editor state management
- Returns: latexCode, activeTab, agentState, documentState

#### `useLatexHistory.ts`

- Manages version history with debouncing
- Auto-saves versions every 2 seconds
- Returns: history array, handleRevert function

#### `useAgentConnection.ts`

- WebSocket connection to LaTeX Agent
- Auto-reconnect logic
- Message handling
- Returns: wsConnected, sendMessage function

#### `useProjectMessages.ts`

- Fetches and manages chat messages
- Saves messages/responses to database
- Returns: messages array, addMessage, save functions

#### `useProjectDetails.ts`

- Fetches project details
- Handles project title editing and saving
- Returns: projectTitle, edit handlers

#### `useProjectUsers.ts`

- Fetches project collaborators
- Handles collaborator invitations
- Returns: users array, invite handlers

## Features Preserved

✅ Chat interface with message history
✅ LaTeX editor with live preview
✅ Version history and revert functionality
✅ LaTeX Agent integration via WebSocket
✅ PDF download
✅ Project title editing
✅ Collaborator management
✅ Document selection for agent context
✅ Auto-save functionality
✅ Responsive layout with sidebar

## Testing Checklist

- [ ] Messages display correctly
- [ ] LaTeX compilation works
- [ ] Preview updates in real-time
- [ ] History records and reverts work
- [ ] Agent connection and messages flow
- [ ] PDF download succeeds
- [ ] Project title can be edited
- [ ] Collaborators can be invited
- [ ] Responsive on different screen sizes

## Size Comparison

| Metric                | Original  | Refactored |
| --------------------- | --------- | ---------- |
| ProjectPage lines     | 1346      | ~150       |
| Total component files | 1         | 11         |
| Total hook files      | 0         | 7          |
| Reusability           | Low       | High       |
| Testability           | Difficult | Easy       |

## Next Steps

1. **Test the refactored version** - Ensure all features work as expected
2. **Update imports** - Ensure all components import correctly
3. **Deploy gradually** - Use feature flags if needed
4. **Monitor for issues** - Watch for bugs in production

## Notes

- All API endpoints remain the same
- No database changes required
- Backward compatible with existing features
- Can be deployed independently
- Easier to add new features in the future
