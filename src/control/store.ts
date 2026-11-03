"use client";

import { useSyncExternalStore } from "react";
import type { Rubric } from "@/entities/types";
import { seedRubric } from "@/entities/seed";

export interface DB { 
    rubrics: Rubric[] 
}
const KEY = "raser-showcase-v1";
export const EMPTY: DB = { 
    rubrics: [] 
};

let state: DB = EMPTY;

let loaded = false;

const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") {
    return;
  }
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? (JSON.parse(raw) as DB) : { rubrics: [seedRubric()] };
  } catch { 
    state = { rubrics: [seedRubric()] }; 
  }
}

export function getDB(): DB { 
    load(); 
    return state; 
}

export function update(fn: (db: DB) => DB) {
  state = fn(getDB());
  try { 
    window.localStorage.setItem(KEY, JSON.stringify(state)); 
  } catch { 
    
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) { 
  listeners.add(l); 
  return () => { 
    listeners.delete(l); 
  }; 
}

export const useDB = () => useSyncExternalStore(subscribe, getDB, () => EMPTY);

export const useReady = () => useSyncExternalStore(() => () => {}, () => true, () => false);
