# Git Workflow Guide

This document outlines the Git workflow for our Vietnamese Glasses Store project to ensure consistent and efficient collaboration.

## Branching Strategy

We follow a modified GitFlow approach with the following branches:

### Main Branches

- **master**: Production-ready code. Only merge from `develop` or hotfix branches.
- **develop**: Main development branch. Features, bugfixes, and improvements are merged here.

### Supporting Branches

- **feature/***:  For new features (e.g., `feature/shopping-cart`)
- **bugfix/***:   For bug fixes (e.g., `bugfix/login-error`)
- **hotfix/***:   For urgent fixes to production (e.g., `hotfix/security-issue`)
- **release/***:  For preparing releases (e.g., `release/v1.0.0`)

## Branch Naming Convention

- Use lowercase letters and hyphens
- Prefix with the branch type (feature, bugfix, etc.)
- Include a brief description of the work
- Include issue/ticket number if applicable

Examples:
```
feature/user-profile
bugfix/cart-total-calculation
hotfix/security-vulnerability-123
```

## Commit Message Guidelines

Follow these rules for commit messages:

1. Start with a capital letter
2. Use the imperative mood ("Add feature" not "Added feature")
3. Keep the first line under 50 characters
4. Provide more details in the commit body if needed (separated by a blank line)
5. Reference issue numbers in the footer

Example:
```
Add user profile page

- Create profile component
- Implement API endpoints for user data
- Add avatar upload functionality

Fixes #123
```

## Workflow Steps

### Starting a New Feature

1. Update your local repo:
   ```
   git checkout develop
   git pull origin develop
   ```

2. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

3. Write code, commit regularly:
   ```
   git add .
   git commit -m "Meaningful commit message"
   ```

4. Push your branch to remote:
   ```
   git push -u origin feature/your-feature-name
   ```

### Updating Your Branch with Latest Changes

When you need to update your feature branch with the latest changes from develop:

```
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git merge develop
```

Resolve any conflicts if they occur.

### Submitting for Review

1. Ensure your branch is up to date with develop
2. Run tests to ensure everything works
3. Push your final changes
4. Create a pull request on GitHub from your feature branch to develop
5. Request code reviews from team members

### After Review Approval

The code will be merged into the develop branch by the reviewer or designated team member.

## Best Practices

1. **Commit Often**: Make small, focused commits that are easy to review
2. **Pull Regularly**: Keep your local copy updated with the latest changes
3. **Review Your Changes**: Before pushing, review your own code first
4. **Write Descriptive Messages**: Make sure others understand the purpose of your changes
5. **Keep Branches Focused**: One branch should address one feature or issue
6. **Delete Old Branches**: Clean up branches that have been merged

## Handling Conflicts

If you encounter merge conflicts:

1. Understand what's causing the conflict
2. Discuss with the relevant team members if needed
3. Resolve conflicts in your editor
4. Test thoroughly after resolving conflicts
5. Commit the resolved conflicts

## Git Configuration

Ensure your Git is configured with your name and email:

```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Useful Git Commands

- View branch status: `git status`
- View commit history: `git log --oneline --graph`
- Discard local changes: `git checkout -- file-name`
- Temporarily store changes: `git stash`
- Apply stashed changes: `git stash pop`
- View differences: `git diff` 