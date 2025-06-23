// pages/api/messages.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { notion } from '../../lib/notion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const databaseId = process.env.NOTION_DATABASE_ID!;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
    });

    const messages = response.results.map((page: any) => {
      const message = page.properties["Teile deine Meinung!"]?.title?.[0]?.text?.content || 'Ohne Text';
      return {
        //id: page.id,
        message,
      };
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Notion-Daten.' });
  }
}
