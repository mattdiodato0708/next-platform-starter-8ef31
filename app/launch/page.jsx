import Link from 'next/link';
import { Card } from 'components/card';
import { Markdown } from 'components/markdown';

// Default to the canonical template; NEXT_PUBLIC_* values are inlined at build time. Override with
// NEXT_PUBLIC_REPLIT_IMPORT_URL (set at build time) to point at your fork.
const DEFAULT_REPLIT_IMPORT_URL = 'https://replit.com/github/netlify-templates/next-platform-starter';
const replitImportUrl = process.env.NEXT_PUBLIC_REPLIT_IMPORT_URL || DEFAULT_REPLIT_IMPORT_URL;

const quickStart = (url) => `
1. In Replit, choose **Create Repl → Import from GitHub** and paste \`${url}\`.
2. After the Repl opens, go to **Tools → Secrets** and add your environment variables (keep API keys and other secrets here).
3. Install and run the dev server in the shell (the host/port flags keep it reachable from Replit's proxy):

\`\`\`bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
\`\`\`

4. Click **Open in Browser** (Replit will proxy port 3000).`;

const notes = `
- Override the import link with \`NEXT_PUBLIC_REPLIT_IMPORT_URL\` (set at build time) to point at your fork; otherwise this template URL is used.
- The app works on Replit without Netlify-specific features. Use Replit Secrets for anything sensitive.
- If you set \`CONTEXT=dev\` the context card will render; otherwise it is hidden by default.
- \`NEXT_PUBLIC_DISABLE_UPLOADS=true\` will turn off uploads if you want to run without blob storage.`;

/**
 * Landing page for Replit instructions. Uses NEXT_PUBLIC_REPLIT_IMPORT_URL to allow pointing the import
 * link at a fork while defaulting to the canonical template.
 */
export default function LaunchPage() {
    return (
        <div className="flex flex-col gap-8">
            <section className="flex flex-col gap-4">
                <h1>Launch on Replit</h1>
                <p className="text-lg text-neutral-700">
                    Import the project into Replit, keep your secret keys in Replit Secrets, and start the dev server
                    with one command.
                </p>
                <div className="flex flex-wrap gap-3">
                    <Link href="/" className="btn btn-outline">
                        Back to Home
                    </Link>
                    <Link href={replitImportUrl} className="btn">
                        Open in Replit
                    </Link>
                </div>
                <div className="flex flex-col gap-2 rounded-sm border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                    <div className="font-medium text-neutral-900">Copy this import URL for Replit:</div>
                    <code className="break-all rounded bg-neutral-100 px-2 py-1 text-neutral-800">{replitImportUrl}</code>
                </div>
            </section>
            <Card title="Quick Start">
                <Markdown content={quickStart(replitImportUrl)} />
            </Card>
            <Card title="Notes">
                <Markdown content={notes} />
            </Card>
        </div>
    );
}
