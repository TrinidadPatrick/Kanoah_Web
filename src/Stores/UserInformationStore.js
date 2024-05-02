import {create} from 'zustand';

const userInformationStore = create((set) => ({
  userDetails : null,
  setUserDetails: (value) => set(() => ({ userDetails: value })),
}));

export default userInformationStore;