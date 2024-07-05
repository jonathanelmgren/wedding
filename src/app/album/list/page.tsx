import { getAlbums } from "@/utils/getAlbums";

const Page = async () => {
  const { albums } = (await getAlbums()) || { albums: [] };
  return (
    <div className="relative min-h-screen">
      {albums &&
        albums.map((album) => (
          <div key={album.id}>
            {album.title}: {album.id}
          </div>
        ))}
    </div>
  );
};

export default Page;
