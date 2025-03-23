declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCaptchaVO_ = {
    code?: number
    data?: CaptchaVO
    message?: string
  }

  type BaseResponseListCategoryVO_ = {
    code?: number
    data?: CategoryVO[]
    message?: string
  }

  type BaseResponseListGrabPictureResult_ = {
    code?: number
    data?: GrabPictureResult[]
    message?: string
  }

  type BaseResponseListSearchPictureResult_ = {
    code?: number
    data?: SearchPictureResult[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponsePageVOCategoryVO_ = {
    code?: number
    data?: PageVOCategoryVO_
    message?: string
  }

  type BaseResponsePageVOMenuVO_ = {
    code?: number
    data?: PageVOMenuVO_
    message?: string
  }

  type BaseResponsePageVOPictureHomeVO_ = {
    code?: number
    data?: PageVOPictureHomeVO_
    message?: string
  }

  type BaseResponsePageVOPictureVO_ = {
    code?: number
    data?: PageVOPictureVO_
    message?: string
  }

  type BaseResponsePageVOScheduledTaskVO_ = {
    code?: number
    data?: PageVOScheduledTaskVO_
    message?: string
  }

  type BaseResponsePageVOSpaceVO_ = {
    code?: number
    data?: PageVOSpaceVO_
    message?: string
  }

  type BaseResponsePageVOUserVO_ = {
    code?: number
    data?: PageVOUserVO_
    message?: string
  }

  type BaseResponsePictureDetailVO_ = {
    code?: number
    data?: PictureDetailVO
    message?: string
  }

  type BaseResponseSpaceDetailVO_ = {
    code?: number
    data?: SpaceDetailVO
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUserDetailVO_ = {
    code?: number
    data?: UserDetailVO
    message?: string
  }

  type CaptchaVO = {
    captchaImage?: string
    captchaKey?: string
  }

  type Category = {
    categoryId?: number
    createTime?: string
    current?: number
    editTime?: string
    isDelete?: number
    multipleSort?: boolean
    name?: string
    pageSize?: number
    parentId?: number
    sort?: Sort
    sorts?: Sort[]
    updateTime?: string
    useNum?: number
    userId?: number
  }

  type CategoryAddRequest = {
    name?: string
    parentId?: number
  }

  type CategoryQueryRequest = {
    categoryId?: number
    current?: number
    multipleSort?: boolean
    name?: string
    pageSize?: number
    parentId?: number
    sort?: Sort
    sorts?: Sort[]
    useNum?: number
    userId?: number
  }

  type CategoryUpdateRequest = {
    categoryId?: number
    name?: string
    parentId?: number
    useNum?: number
  }

  type CategoryVO = {
    categoryId?: number
    createTime?: string
    name?: string
    parentId?: number
    useNum?: number
    userId?: number
  }

  type DeleteRequest = {
    id?: number
  }

  type getPictureDetailByIdUsingGETParams = {
    /** pictureId */
    pictureId?: number
  }

  type getPicturePageListAsHomeUsingGETParams = {
    categoryId?: number
    current?: number
    endCreateTime?: string
    endEditTime?: string
    multipleSort?: boolean
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originWidth?: number
    pageSize?: number
    picDesc?: string
    picName?: string
    pictureId?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerUser?: number
    searchText?: string
    'sort.asc'?: boolean
    'sort.field'?: string
    'sorts[0].asc'?: boolean
    'sorts[0].field'?: string
    spaceId?: number
    startCreateTime?: string
    startEditTime?: string
    tags?: string
    userId?: number
  }

  type getUserDetailByIdUsingGETParams = {
    /** userId */
    userId?: number
  }

  type GrabPictureResult = {
    handleImageUrl?: string
    imageName?: string
    imageUrl?: string
  }

  type LoginUserVO = {
    birthday?: string
    createTime?: string
    inviteUserId?: number
    leftMenus?: string[]
    otherMenus?: string[]
    shareCode?: string
    token?: string
    topMenus?: string[]
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type MenuAddRequest = {
    menuName?: string
    menuPath?: string
    menuPosition?: number
    parentId?: number
  }

  type MenuQueryRequest = {
    createTime?: string
    current?: number
    editTime?: string
    isDisabled?: number
    menuId?: number
    menuName?: string
    menuPath?: string
    menuPosition?: number
    multipleSort?: boolean
    pageSize?: number
    parentId?: number
    sort?: Sort
    sorts?: Sort[]
    updateTime?: string
  }

  type MenuUpdateRequest = {
    menuId?: number
    menuName?: string
    menuPath?: string
    menuPosition?: number
    parentId?: number
  }

  type MenuVO = {
    createTime?: string
    editTime?: string
    isDelete?: number
    isDisabled?: number
    menuId?: number
    menuName?: string
    menuPath?: string
    menuPosition?: number
    parentId?: number
  }

  type PageVOCategoryVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: CategoryVO[]
    total?: number
  }

  type PageVOMenuVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: MenuVO[]
    total?: number
  }

  type PageVOPictureHomeVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: PictureHomeVO[]
    total?: number
  }

  type PageVOPictureVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: PictureVO[]
    total?: number
  }

  type PageVOScheduledTaskVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: ScheduledTaskVO[]
    total?: number
  }

  type PageVOSpaceVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: SpaceVO[]
    total?: number
  }

  type PageVOUserVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: UserVO[]
    total?: number
  }

  type PictureDetailVO = {
    categoryId?: number
    categoryName?: string
    collectQuantity?: number
    compressFormat?: string
    compressSize?: number
    createTime?: string
    downloadQuantity?: number
    isShare?: number
    likeQuantity?: number
    loginUserIsCollect?: boolean
    loginUserIsLike?: boolean
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originSize?: number
    originWidth?: number
    picDesc?: string
    picName?: string
    picUrl?: string
    pictureId?: number
    reviewStatus?: number
    shareQuantity?: number
    spaceId?: number
    spaceName?: string
    spaceType?: number
    tagList?: string[]
    tags?: string
    thumbnailUrl?: string
    userAvatar?: string
    userId?: number
    userName?: string
    viewQuantity?: number
  }

  type PictureEditRequest = {
    categoryId?: number
    picDesc?: string
    picName?: string
    pictureId?: number
    spaceId?: number
    tagList?: string[]
  }

  type PictureGrabRequest = {
    grabCount?: number
    grabSource?: string
    keyword?: string
    namePrefix?: string
    randomSeed?: number
  }

  type PictureHomeVO = {
    categoryId?: number
    collectQuantity?: number
    downloadQuantity?: number
    isShare?: number
    likeQuantity?: number
    loginUserIsCollect?: boolean
    loginUserIsLike?: boolean
    picDesc?: string
    picName?: string
    picUrl?: string
    pictureId?: number
    shareQuantity?: number
    tags?: string
    thumbnailUrl?: string
    userAvatar?: string
    userId?: number
    userName?: string
    viewQuantity?: number
  }

  type PictureInteractionRequest = {
    interactionStatus?: number
    interactionType?: number
    pictureId?: number
  }

  type PictureQueryRequest = {
    categoryId?: number
    current?: number
    endCreateTime?: string
    endEditTime?: string
    multipleSort?: boolean
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originWidth?: number
    pageSize?: number
    picDesc?: string
    picName?: string
    pictureId?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerUser?: number
    searchText?: string
    sort?: Sort
    sorts?: Sort[]
    spaceId?: number
    startCreateTime?: string
    startEditTime?: string
    tags?: string
    userId?: number
  }

  type PictureReviewRequest = {
    idList?: number[]
    pictureId?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureSearchRequest = {
    pictureId?: number
    randomSeed?: number
    searchCount?: number
    searchSource?: string
  }

  type PictureUploadRequest = {
    categoryId?: number
    picDesc?: string
    picName?: string
    pictureId?: number
    pictureUrl?: string
    spaceId?: number
    tags?: string[]
  }

  type PictureVO = {
    categoryId?: number
    categoryInfo?: Category
    collectQuantity?: number
    compressFormat?: string
    compressPath?: string
    compressSize?: number
    createTime?: string
    downloadQuantity?: number
    editTime?: string
    isDelete?: number
    isShare?: number
    likeQuantity?: number
    originColor?: string
    originFormat?: string
    originHeight?: number
    originName?: string
    originPath?: string
    originScale?: number
    originSize?: number
    originUrl?: string
    originWidth?: number
    picDesc?: string
    picName?: string
    picUrl?: string
    pictureId?: number
    resourceStatus?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerUser?: number
    shareQuantity?: number
    spaceId?: number
    spaceInfo?: Space
    tagList?: string[]
    tags?: string
    thumbnailPath?: string
    thumbnailUrl?: string
    updateTime?: string
    userId?: number
    userInfo?: User
    viewQuantity?: number
  }

  type ScheduledTaskAddRequest = {
    taskBean?: string
    taskCron?: string
    taskDesc?: string
    taskName?: string
  }

  type ScheduledTaskQueryRequest = {
    createTime?: string
    current?: number
    editTime?: string
    multipleSort?: boolean
    pageSize?: number
    sort?: Sort
    sorts?: Sort[]
    taskBean?: string
    taskCron?: string
    taskDesc?: string
    taskId?: number
    taskKey?: string
    taskName?: string
    taskStatus?: number
  }

  type ScheduledTaskUpdateRequest = {
    taskBean?: string
    taskCron?: string
    taskDesc?: string
    taskId?: number
    taskKey?: string
    taskName?: string
    taskStatus?: number
  }

  type ScheduledTaskVO = {
    createTime?: string
    editTime?: string
    taskBean?: string
    taskCron?: string
    taskDesc?: string
    taskId?: number
    taskKey?: string
    taskName?: string
    taskStatus?: number
  }

  type SearchPictureResult = {
    imageKey?: string
    imageName?: string
    imageUrl?: string
  }

  type Sort = {
    asc?: boolean
    field?: string
  }

  type Space = {
    createTime?: string
    current?: number
    editTime?: string
    isDelete?: number
    maxCount?: number
    maxSize?: number
    multipleSort?: boolean
    pageSize?: number
    sort?: Sort
    sorts?: Sort[]
    spaceId?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    updateTime?: string
    usedCount?: number
    usedSize?: number
    userId?: number
    userInfo?: User
  }

  type SpaceActivateRequest = {
    spaceName?: string
  }

  type SpaceDetailVO = {
    createTime?: string
    maxCount?: number
    maxSize?: number
    maxSizeUnit?: string
    spaceId?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    usedSizeUnit?: string
    userId?: number
  }

  type SpaceEditRequest = {
    spaceId?: number
    spaceName?: string
  }

  type SpaceQueryRequest = {
    current?: number
    multipleSort?: boolean
    pageSize?: number
    sort?: Sort
    sorts?: Sort[]
    spaceId?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type SpaceUpdateRequest = {
    maxCount?: number
    maxSize?: number
    spaceId?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    isDelete?: number
    maxCount?: number
    maxSize?: number
    maxSizeUnit?: string
    spaceId?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    usedSizeUnit?: string
    userId?: number
    userInfo?: User
  }

  type uploadPictureByFileUsingPOSTParams = {
    categoryId?: number
    picDesc?: string
    picName?: string
    pictureId?: number
    pictureUrl?: string
    spaceId?: number
    tags?: string[]
  }

  type User = {
    admin?: boolean
    birthday?: string
    createTime?: string
    current?: number
    editTime?: string
    inviteUserId?: number
    isDelete?: number
    isDisabled?: number
    leftMenus?: string[]
    multipleSort?: boolean
    otherMenus?: string[]
    pageSize?: number
    shareCode?: string
    sort?: Sort
    sorts?: Sort[]
    token?: string
    topMenus?: string[]
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPassword?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipCode?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type UserDetailVO = {
    birthday?: string
    createTime?: string
    inviteUserId?: number
    isDisabled?: number
    shareCode?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type UserEditRequest = {
    birthday?: string
    shareCode?: string
    userAccount?: string
    userAvatar?: string
    userId?: number
    userName?: string
    userPhone?: string
    userProfile?: string
  }

  type UserLoginRequest = {
    captchaCode?: string
    captchaKey?: string
    userAccount?: string
    userEmail?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    birthday?: string
    current?: number
    inviteUserId?: number
    multipleSort?: boolean
    pageSize?: number
    shareCode?: string
    sort?: Sort
    sorts?: Sort[]
    userAccount?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type UserRegisterRequest = {
    codeKey?: string
    codeValue?: string
    userAccount?: string
    userEmail?: string
  }

  type UserUpdateRequest = {
    birthday?: string
    inviteUserId?: number
    isDisabled?: number
    shareCode?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPassword?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipCode?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type UserVO = {
    birthday?: string
    createTime?: string
    editTime?: string
    inviteUserId?: number
    isDelete?: number
    isDisabled?: number
    shareCode?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userId?: number
    userName?: string
    userPassword?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipCode?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }
}
