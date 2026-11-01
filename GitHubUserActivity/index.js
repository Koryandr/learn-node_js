const userName = process.argv[2];

async function main() {
    const url = `https://api.github.com/users/${userName}/events`;
    if (!userName) {
        console.error('Error: No username provided. Please provide a GitHub username as a command-line argument.');
        process.exit(1);
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length === 0) {
            console.log(`No events found for user: ${userName}`);
            return;
        }

        console.log("Output: ");
        console.log(`User: ${userName}`);
        
        for (const event of data) {
        if (event.type === "WatchEvent") {
            console.log(`-Starred repository: ${event.repo.name}`)
        }
        else if (event.type === "PushEvent") {
            const branchName = event.payload.ref.split('/');
            console.log(`-Pushed changes to ${event.repo.name} on branch ${branchName[2]}`);
        }
        else if (event.type === "ForkEvent") {
            console.log(`Forked repository: ${event.repo.name}`);
        }
        else if (event.type === "IssuesEvent") {
            console.log(`-${event.payload.action} issue in ${event.repo.name}`);
        }
        else if (event.type === "PullRequestEvent") {
            console.log(`${event.payload.action} pull request in ${event.repo.name}`);
        }}

    } catch (error) {
        console.error('Error fetching user events:', error);
    }
}

main();