# Podcast fetcher spec

Read from `shows.txt` of a format:

    name1 http://url1.xml 11
    name2 http://url2.xml 22
    ...

The name is the podcast name. It is also the filename used for saving. The URL is the RSS feed. The number is a "milestone" indicating the last previous successful download.

All files are saved using the "name" field, not the file from the RSS XML. For example: `astronomycast-123.mp3`.

## Start

Read all of the podcasts to fetch. For each podcast, get the feed.

For each successful feed fetch, get an ordered list of files to download.

Remove from the list all files "before" the last successful download. TODO: "before" may not be a simple integer; some podcasts may use a date (I think skepticast does).

For each remaining file, fetch them one at a time, oldest first.

## Fetch

Since this will fetch to ~/Dropbox, I want to avoid empty or partial files. So for now, just store the contents in a buffer, and
dump it to disk in one batch.

When the file is fully downloaded, confirm any size or checksum information from RSS.

Write it to disk using the filename `name + "-" + number + ".mp3"`.

If the write to disk succeeds, update `pods.txt` with the new milestone number. Use synchronous i/o to read and write it in the same tick to avoid any issues if two downloads finish at the same time and two podcasts update concurrently.
