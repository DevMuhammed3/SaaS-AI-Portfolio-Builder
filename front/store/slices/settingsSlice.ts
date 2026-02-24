import { devLog } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ==========================================
// TYPES & INTERFACES
// ==========================================
/**
 * Main settings state interface
 * Contains all application settings
 */
interface SettingsState {
  loading: boolean; // Loading state for async operations
  error: string | null; // Error message if any operation fails
  initialized: boolean; // Indicates if settings have been initialized
}

// ==========================================
// INITIAL STATE
// ==========================================

/**
 * Initial state for settings
 * Provides default values before API data is loaded
 */
const initialState: SettingsState = {
  loading: false,
  error: null,
  initialized: false, // Indicates if settings have been initialized
};

// ==========================================
// ASYNC THUNKS
// ==========================================

/**
 * Async thunk to fetch settings from the API
 * Makes a GET request to /api/shop/settings to retrieve current settings
 *
 * @returns Promise<SettingsState> - The settings data from the API
 * @throws Will throw an error if the API request fails
 */
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async ({ token }: { token: string }, thunkAPI) => {
    try {
      const response = await apiClient.get(`/api/shop`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data.settings;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch settings " + error);
    }
  }
);

/**
 * Async thunk to update settings via API
 * Makes a PUT request to /api/shop/settings to update settings
 *
 * @param settingsData - Partial settings data to update
 * @returns Promise<SettingsState> - The updated settings data from the API
 * @throws Will throw an error if the API request fails
 */
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (
    settingsData: Partial<
      Omit<SettingsState, "loading" | "error" | "initialized">
    >,
    { rejectWithValue }
  ) => {
    try {
      devLog.error("🔄 Updating settings via API...", settingsData);

      // Make API request to update settings
      const response = await fetch("/api/shop/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      // Check if response is successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Parse response data
      const data = await response.json();
      devLog.warn("✅ Settings updated successfully:", data);

      return data;
    } catch (error) {
      devLog.error("❌ Error updating settings:", error);

      // Return a rejected value with error message
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update settings";
      return rejectWithValue(errorMessage);
    }
  }
);

// ==========================================
// SETTINGS SLICE
// ==========================================

/**
 * Settings slice using Redux Toolkit
 * Manages application settings state with async operations
 */
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    /**
     * Clear any error messages
     * Used to reset error state after user acknowledgment
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset settings to initial state
     * Used for logout or reset functionality
     */
    resetSettings: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // ==========================================
    // FETCH SETTINGS CASES
    // ==========================================

    /**
     * Handle pending state for fetchSettings
     * Sets loading to true and clears any previous errors
     */
    builder.addCase(fetchSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      devLog.warn("⏳ Fetching settings - pending...");
    });

    /**
     * Handle fulfilled state for fetchSettings
     * Updates state with fetched data and sets loading to false
     */
    builder.addCase(fetchSettings.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.initialized = true;

      // Update settings with API data
      devLog.warn("✅ Settings fetch completed successfully");
    });

    /**
     * Handle rejected state for fetchSettings
     * Sets error message and stops loading
     */
    builder.addCase(fetchSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch settings";
      state.initialized = true; // Still mark as initialized to prevent infinite loading
      devLog.warn("❌ Settings fetch failed:", state.error);
    });

    // ==========================================
    // UPDATE SETTINGS CASES
    // ==========================================

    /**
     * Handle pending state for updateSettings
     * Sets loading to true and clears any previous errors
     */
    builder.addCase(updateSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
      devLog.warn("⏳ Updating settings - pending...");
    });

    /**
     * Handle fulfilled state for updateSettings
     * Updates state with new data from API response
     */
    builder.addCase(updateSettings.fulfilled, (state) => {
      state.loading = false;
      state.error = null;

      devLog.warn("✅ Settings update completed successfully");
    });

    /**
     * Handle rejected state for updateSettings
     * Sets error message and stops loading
     */
    builder.addCase(updateSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to update settings";
      devLog.warn("❌ Settings update failed:", state.error);
    });
  },
});

// ==========================================
// EXPORTS
// ==========================================

// Export actions for use in components
export const { clearError, resetSettings } = settingsSlice.actions;

// Export reducer for store configuration
export default settingsSlice.reducer;

// ==========================================
// SELECTORS
// ==========================================

/**
 * Selector to get all settings state
 * @param state - Root state
 * @returns Complete settings state
 */
export const selectSettings = (state: { settings: SettingsState }) =>
  state.settings;

/**
 * Selector to get loading state
 * @param state - Root state
 * @returns Boolean indicating if settings are being loaded
 */
export const selectSettingsLoading = (state: { settings: SettingsState }) =>
  state.settings.loading;

/**
 * Selector to get error state
 * @param state - Root state
 * @returns Error message or null
 */
export const selectSettingsError = (state: { settings: SettingsState }) =>
  state.settings.error;

/**
 * Selector to check if settings are initialized
 * @param state - Root state
 * @returns Boolean indicating if settings have been loaded initially
 */
export const selectSettingsInitialized = (state: { settings: SettingsState }) =>
  state.settings.initialized;
