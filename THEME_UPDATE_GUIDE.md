# Theme Update Checklist

## Before Updating Chirpy Theme

1. **Create a backup branch**
   ```bash
   git checkout -b backup-before-theme-update
   git push origin backup-before-theme-update
   ```

2. **Document your customizations**
   - [ ] Custom layouts: `_layouts/slide.html`
   - [ ] Modified includes: `_includes/head.html` (line 128: added presentation-mode.js)
   - [ ] Custom assets: `assets/js/presentation-mode.js`
   - [ ] Config changes: `_config.yml`

3. **Check what files you've modified**
   ```bash
   # Compare with theme gem
   bundle info --path jekyll-theme-chirpy
   # Then diff your local files with gem files
   ```

## Update Process

### Option 1: Conservative (Recommended)
Update only the gem version in `Gemfile`:
```ruby
gem "jekyll-theme-chirpy", "~> 7.5"  # Update version
```

Then:
```bash
bundle update jekyll-theme-chirpy
```

**Pros:** Your local customizations remain intact
**Cons:** You miss new theme features in `_layouts/` and `_includes/`

### Option 2: Full Update (Risky)
1. Delete your local `_layouts/` and `_includes/` folders
2. Copy new versions from updated gem
3. Manually re-apply your customizations

**Commands:**
```bash
# Backup first
cp -r _layouts _layouts.backup
cp -r _includes _includes.backup

# Get theme path
THEME_PATH=$(bundle info --path jekyll-theme-chirpy)

# Copy new files
cp -r $THEME_PATH/_layouts/* _layouts/
cp -r $THEME_PATH/_includes/* _includes/

# Now manually re-apply your changes!
```

## Your Critical Customizations to Preserve

### 1. `_layouts/slide.html`
**Status:** Custom file (doesn't exist in theme)
**Action:** Safe - won't be overwritten

### 2. `_includes/head.html`
**Status:** Modified (added line 128)
**Custom code:**
```html
<!-- Presentation mode script (custom) -->
<script src="{{ '/assets/js/presentation-mode.js' | relative_url }}"></script>
```
**Action:** Must re-add after theme update!

### 3. `assets/js/presentation-mode.js`
**Status:** Custom file
**Action:** Safe - won't be overwritten

### 4. `_config.yml`
**Status:** Modified (title, tagline, description)
**Action:** Safe - theme won't overwrite this

## Recommended Workflow

1. **Stay on current version** until you need new features
2. **When updating:**
   - Check Chirpy's changelog: https://github.com/cotes2020/chirpy-starter/releases
   - If only bug fixes → Update gem only (Option 1)
   - If new features you want → Full update (Option 2)

3. **Use git to track changes:**
   ```bash
   git diff _includes/head.html  # See your customizations
   ```

## Quick Safety Check

Before any update, run:
```bash
# See all your modifications
git diff --name-only HEAD

# Most important - check these files:
git diff _includes/head.html
```

## Alternative: Use Theme Without Copying

If you want easier updates, consider switching to **remote theme** approach:
```yaml
# _config.yml
remote_theme: cotes2020/chirpy
```

Then only override files you need to customize.
**Trade-off:** Less control, but easier updates.

---

**Summary:**
- ✅ Your custom files (`slide.html`, `presentation-mode.js`) are safe
- ⚠️ Modified theme files (`head.html`) will be overwritten
- 💡 Always backup and document customizations before updating!