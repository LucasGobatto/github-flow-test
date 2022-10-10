export interface BranchDetails {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection: {
    required_status_checks: {
      enforcement_level: string;
      contexts: string[];
    };
  };
  protection_url: string;
}

export interface CommitsModel {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
    url: string;
    comment_count: number;
    verification: {
      verified: false;
      reason: string;
      signature: unknown;
      payload: unknown;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: unknown;
  committer: unknown;
  parents: {
    sha: string;
    url: string;
    html_url: string;
  }[];
}
