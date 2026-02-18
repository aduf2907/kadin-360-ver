// This is a mock service to simulate follow/unfollow actions.
// In a real application, this would make authenticated API calls to a backend.

/**
 * Simulates following a user.
 * @param userId The ID of the user to follow.
 * @returns A promise that resolves to an object indicating success.
 */
export const followUser = async (userId: number): Promise<{ success: boolean }> => {
    console.log(`Following user with ID: ${userId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Successfully followed user ${userId}.`);
            resolve({ success: true });
        }, 500); // Simulate network delay
    });
};

/**
 * Simulates unfollowing a user.
 * @param userId The ID of the user to unfollow.
 * @returns A promise that resolves to an object indicating success.
 */
export const unfollowUser = async (userId: number): Promise<{ success: boolean }> => {
    console.log(`Unfollowing user with ID: ${userId}`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`Successfully unfollowed user ${userId}.`);
            resolve({ success: true });
        }, 500); // Simulate network delay
    });
};
