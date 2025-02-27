export interface User {
    idToken: string;
    /**
     * Id on agentX server
     */
    id: any; 
    name: string;
    email: string;
    photoUrl?: string;
    firstName: string;
    lastName: string;
    walletAddress?: string;
}
  