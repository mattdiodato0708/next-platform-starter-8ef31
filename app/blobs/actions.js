'use server';
import { getStore } from '@netlify/blobs';
import { uploadDisabled } from 'utils';

function store() {
    return getStore({ name: 'shapes', consistency: 'strong' });
}

// Keep validation ranges aligned with generateBlob defaults.
const edgesRange = { min: 3, max: 20 };
const growthRange = { min: 2, max: 9 };
const maxNameLength = 64;

function sanitizeParameters(parameters) {
    if (!parameters || typeof parameters !== 'object') {
        throw new Error('Invalid shape parameters');
    }

    const name = typeof parameters.name === 'string' ? parameters.name.trim() : '';
    const safeName = name.replace(/[^-a-zA-Z0-9]/g, '').slice(0, maxNameLength);
    const seed = Number(parameters.seed);
    const edges = Number(parameters.edges);
    const growth = Number(parameters.growth);
    const colors = Array.isArray(parameters.colors)
        ? parameters.colors
              .map((color) => (typeof color === 'string' ? color.trim() : ''))
              .filter((color) =>
                  /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
                      color
                  )
              )
        : [];

    if (safeName.length === 0) {
        throw new Error('Invalid shape parameters');
    }

    if (
        !Number.isSafeInteger(seed) ||
        !Number.isInteger(edges) ||
        edges < edgesRange.min ||
        edges > edgesRange.max ||
        !Number.isInteger(growth) ||
        growth < growthRange.min ||
        growth > growthRange.max ||
        colors.length !== 2
    ) {
        throw new Error('Invalid shape parameters');
    }

    return { name: safeName, seed, edges, growth, colors };
}

export async function uploadShapeAction({ parameters }) {
    if (uploadDisabled) throw new Error('Sorry, uploads are disabled');

    const sanitizedParameters = sanitizeParameters(parameters);
    const key = sanitizedParameters.name;
    await store().setJSON(key, sanitizedParameters);
    console.log('Stored shape with parameters:', sanitizedParameters, 'to key:', key);
}

export async function listShapesAction() {
    const data = await store().list();
    const keys = data.blobs.map(({ key }) => key);
    return keys;
}

export async function getShapeAction({ keyName }) {
    const data = await store().get(keyName, { type: 'json' });
    return data;
}
