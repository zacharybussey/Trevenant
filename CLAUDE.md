0a. study .specs/** to learn about project specifications

0b. study .specs/fix_plan.md

1. Your task is to implement missing features (see .specs/features/*) and functionality and produce completed code using parallel subagents.

1a. Follow the .specs/fix_plan.md and choose the most important 5 things.

1b. Do not assume a feature is not implemented until you have searched the codebase to confirm.

1c. Before making changes search codebase using subagents. You may use up to 10 parallel subagents for all operations but only 1 subagent for build/tests.

1d. Items in .specs/project.md file supercede the items in .specs/features/* unless otherwise explicitly stated.  Consider items in the features folder additive guidelines and further speculation.

2. After implementing functionality or resolving a problem, create andrun the tests for the unit of code improved.  If functionality is missing, it's your job to add that functionality per the application specifications.  Think hard.

2a. When you discover an issue, immediately update .specs/fix_plan.md with your findings using a subagent. When the issue is resolved, update .specs/fix_plan.md and remove the item using a subagent.

2b. Maintain a section at the top of .specs/fix_plan.md for "Immediate Priority Fixes" and a "Current Summary" section which will give you the most beneficial overview of the current project state in order to proceed.

2c. Always update the "Immediate Priority Fixes" section with the current state of that fix ("in progress," "errored," "abandoned," "resolved") and highly prioritize items in an errored state.  Move items from that list when they are completed or no longer immediate priority fixes.

999. Important: When authoring documentation, capture why tests and the backing implementation is important.

99999. Important: We want single sources of truth, no migrations/adapters with the exception of the database.  If tests unrelated to your work fail then it's your job to resolve these failing tests as part of the increment of change.

999999999. You may add extra logging if required for debugging issues.

9999999999. ALWAYS KEEP .specs/fix_plan.md up to do date with your learnings, especially after wrapping up/finishing your turn.

99999999999. When you learn something new about how to run the application or examples make sure you update ./AGENTS.md using a subagent, but keep it brief.  For example if you run commands multiple times before learning the correct command then that file should be updated with the correct command.

99999999999999. IMPORTANT when you discover a bug, resolve it using subagents even if it is unrelated to the current piece of work after documenting it in .specs/fix_plan.md.

99999999999999999. The tests for the application should be located in the ./tests/ folder.  Ensure you document the application with a README.md in the same folder as the source code.

9999999999999999999. Keep ./AGENTS.md up to date with information on the game and your learnings to optimise the build/test loop using a subagent.

999999999999999999999. For any bugs you notice, it's important to resolve them or document them in .specs/fix_plan.md to be resolved using a subagent.

99999999999999999999999999. When .specs/fix_plan.md becomes large periodically clean out the items that are completed from the file using a subagent.

9999999999999999999999999999. DO NOT IMPLEMENT PLACEHOLDERS OR SIMPLE IMPLEMENTATIONS. WE WANT FULL IMPLEMENTATIONS. DO IT OR I WILL YELL AT YOU.

9999999999999999999999999999999. SUPER IMPORTANT DO NOT IGNORE. DO NOT PLACE STATUS REPORT UPDATES INTO ./AGENTS.md.