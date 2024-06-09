"use client";

import React, { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from "@tanstack/react-query";
import { useIntersection } from '@mantine/hooks';

const posts = [
    { id: 1, title: "post 1" },
    { id: 2, title: "post 2" },
    { id: 3, title: "post 3" },
    { id: 4, title: "post 4" },
    { id: 5, title: "post 5" },
    { id: 6, title: "post 6" },
    { id: 7, title: "post 7" },
    { id: 8, title: "post 8" },
    { id: 9, title: "post 9" },
    { id: 10, title: "post 10" }
];

// Mock database fetch function
const fetchPosts = async (page: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return posts.slice((page - 1) * 2, page * 2);
};

const InfinitePosts = () => {
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['query'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPosts(pageParam);
            return response;
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
        },
        initialData: {
            pages: [posts.slice(0, 2)], // Initial data for the first page
            pageParams: [1],
        },
    });

    const lastPostRef = useRef<HTMLElement>(null)
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    })

    useEffect(() => {
        if (entry?.isIntersecting) fetchNextPage()
    }, [entry])

    const _posts = data?.pages.flatMap((page) => page)

    return (
        <div className='w-full min-h-[100vh] bg-slate-700 text-white p-10'>
            <h1 className='flex justify-center pb-10 border-b-2'>Infinite Scrolling</h1>
            <div>
                {_posts.map((post, index) => {
                    if (index === _posts.length) <div key={post.id} ref={ref}></div>
                    return <div key={post.id} className=' bg-stone-700 h-[30vh]' ref={lastPostRef ? ref : null}>{post.title}</div>
                })}
            </div>
            {data.pages.length === posts.length / 2 && <div>Nothing more to shown</div>}
        </div>
    );
};

// Create a client
const queryClient = new QueryClient();

const Page = () => (
    <QueryClientProvider client={queryClient}>
        <InfinitePosts />
    </QueryClientProvider>
);

export default Page;