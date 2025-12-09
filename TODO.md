# TODO: Channel Management Pages

## Tasks
-  Create `src/app/channels/manage/page.tsx` to render the channel management page
  - Fetch channels using `fetchChannels` API
  - Map API response to `Channel` type
  - Render `DataTable` with channels data and columns
  - Include loading and error states
-  Create `src/app/channels/[id]/page.tsx` for channel detail page using `fetchChannelDetail`
-  Create `src/app/channels/[id]/members/page.tsx` for channel members page using `fetchChannelMembers`
-  Update `src/app/channels/manage/page.tsx` to add navigation links
  - Channel name links to detail page
  - Member count links to members page
- Add channel detail and members pages to AppSidebar navigation
-  Test navigation between pages
