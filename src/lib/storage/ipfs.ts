import { create } from "kubo-rpc-client";

const ipfs = create({
  url: "http://127.0.0.1:5001/api/v0",
});


export async function storeVC(vc: unknown): Promise<string> {
  const { cid } = await ipfs.add(
    JSON.stringify(vc, null, 2)
  );
  return cid.toString();
}
