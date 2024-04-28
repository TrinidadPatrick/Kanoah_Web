import {create} from 'zustand';

const allServiceStore = create((set) => ({
  staticServices : null,
  services : null,
  setServices: (value) => set(() => ({ services: value })),
  setStaticServices: (value) => set(() => ({ staticServices: value })),
}));

export default allServiceStore;