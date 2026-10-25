//Provides a shared browser-side store instance.

import { RaserStore } from "./RaserStore";
import { LocalStorageRaserRepository } from "./LocalStorageRaserRepository";

// Browser persistence for the prototype. Replace only this adapter when a real backend is introduced.
export const raserStore = new RaserStore(new LocalStorageRaserRepository());
