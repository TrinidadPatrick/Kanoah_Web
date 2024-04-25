import {create} from 'zustand';

const allServiceStore = create((set) => ({
  services : null,
  setServices: (value) => set(() => ({ services: value }))
}));

export default allServiceStore;