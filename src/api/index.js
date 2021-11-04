import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount) => failureCount < 3,
			onError: (err) => console.log(err),
			refetchOnWindowFocus: false,
			notifyOnChangeProps: 'tracked',
		},
	},
});

export * from './candidates';
