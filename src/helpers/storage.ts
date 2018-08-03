class Storage {
  set(data: Partial<StorageData>) {
    let key: keyof StorageData;
    for (key as string in data) {
      let _key = key;
      localStorage.setItem(_key, JSON.stringify(data[_key]));
    }
  }

  get<K extends StorageKey>(
    keys: K[],
    callback: (data: Pick<StorageData, K>) => void
  ) {
    let res: Pick<StorageData, K> = {} as any;
    for (let key of keys) {
      res[key] = JSON.parse(localStorage.getItem(key)) as K;
    }
    callback(res);
  }
}

export let storage = new Storage();
