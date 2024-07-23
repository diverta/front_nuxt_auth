import { ofetch } from 'ofetch';

export const getDynamicUserRoutes = async () => {
    const response = await ofetch('https://dev-nuxt-auth.a.kuroco.app/rcms-api/1/member/list');
    return response.list.flatMap((user) => [`/member/detail/${user.member_id}`, `/ja/member/detail/${user.member_id}`]);
};

export const getDynamicContentRoutes = async () => {
    const response = await ofetch('https://dev-nuxt-auth.a.kuroco.app/rcms-api/1/content/list');
    return response.list.flatMap((user) => [`/topics_detail/${user.topics_id}`, `/ja/topics_detail/${user.topics_id}`]);
};
