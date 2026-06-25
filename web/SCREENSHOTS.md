# Website screenshots

Copy Maestro captures into `admin/`, `teacher/`, and `parent/` before deploying to GitHub Pages.

## Admin (`npm run screenshots:website` in DailyDot_admin)

| Website path | Maestro output |
|---|---|
| `admin/locations.png` | `website-screenshots/admin/01-locations.png` |
| `admin/students.png` | `website-screenshots/admin/02-students.png` |
| `admin/teachers.png` | `website-screenshots/admin/03-teachers.png` |
| `admin/bulletins.png` | `website-screenshots/admin/04-bulletins.png` |
| `admin/shared-device.png` | `website-screenshots/admin/05-settings-shared-device.png` |
| `admin/team.png` | `website-screenshots/admin/06-team.png` *(optional — owner team & permissions)* |

## Teacher (`npm run screenshots:website` in DailyDot_teacher)

| Website path | Maestro output |
|---|---|
| `teacher/students.png` | `website-screenshots/teacher/01-students.png` |
| `teacher/diary.png` | `website-screenshots/teacher/02-diary.png` |
| `teacher/record.png` | `website-screenshots/teacher/03-record.png` |
| `teacher/clock.png` | `website-screenshots/teacher/04-clock-shared.png` |

## Parent (`npm run screenshots:website` in DailyDot_parent)

| Website path | Maestro output |
|---|---|
| `parent/my-kids.png` | `website-screenshots/parent/01-my-kids.png` |
| `parent/activities.png` | `website-screenshots/parent/02-activities.png` |
| `parent/reports.png` | `website-screenshots/parent/03-reports.png` |
| `parent/media.png` | `website-screenshots/parent/04-media.png` |
| `parent/details.png` | `website-screenshots/parent/05-details.png` |

## Quick copy (from repo roots, after Maestro runs)

```bash
# Admin
cp DailyDot_admin/website-screenshots/admin/01-locations.png DailyDot_admin/web/admin/locations.png
cp DailyDot_admin/website-screenshots/admin/02-students.png DailyDot_admin/web/admin/students.png
cp DailyDot_admin/website-screenshots/admin/03-teachers.png DailyDot_admin/web/admin/teachers.png
cp DailyDot_admin/website-screenshots/admin/04-bulletins.png DailyDot_admin/web/admin/bulletins.png
cp DailyDot_admin/website-screenshots/admin/05-settings-shared-device.png DailyDot_admin/web/admin/shared-device.png
cp DailyDot_admin/website-screenshots/admin/06-team.png DailyDot_admin/web/admin/team.png

# Teacher
cp DailyDot_teacher/website-screenshots/teacher/01-students.png DailyDot_admin/web/teacher/students.png
cp DailyDot_teacher/website-screenshots/teacher/02-diary.png DailyDot_admin/web/teacher/diary.png
cp DailyDot_teacher/website-screenshots/teacher/03-record.png DailyDot_admin/web/teacher/record.png
cp DailyDot_teacher/website-screenshots/teacher/04-clock-shared.png DailyDot_admin/web/teacher/clock.png

# Parent
cp DailyDot_parent/website-screenshots/parent/01-my-kids.png DailyDot_admin/web/parent/my-kids.png
cp DailyDot_parent/website-screenshots/parent/02-activities.png DailyDot_admin/web/parent/activities.png
cp DailyDot_parent/website-screenshots/parent/03-reports.png DailyDot_admin/web/parent/reports.png
cp DailyDot_parent/website-screenshots/parent/04-media.png DailyDot_admin/web/parent/media.png
cp DailyDot_parent/website-screenshots/parent/05-details.png DailyDot_admin/web/parent/details.png
```

Use **Release** simulator builds (`expo run:ios --configuration Release`) for clean screenshots without Metro dev overlays.
