import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.confirm
vi.stubGlobal('confirm', vi.fn(() => true));

// Mock window.scrollTo
vi.stubGlobal('scrollTo', vi.fn());
