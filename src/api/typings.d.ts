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

  type BaseResponseListSpaceDetailVO_ = {
    code?: number
    data?: SpaceDetailVO[]
    message?: string
  }

  type BaseResponseListSpaceLevelVO_ = {
    code?: number
    data?: SpaceLevelVO[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageVOCategory_ = {
    code?: number
    data?: PageVOCategory_
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

  type BaseResponsePageVOSpaceUserVO_ = {
    code?: number
    data?: PageVOSpaceUserVO_
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

  type BaseResponsePicture_ = {
    code?: number
    data?: Picture
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

  type BaseResponseUser_ = {
    code?: number
    data?: User
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
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    name?: string
    parentId?: number
    updateTime?: string
    useNum?: number
    userId?: number
  }

  type CategoryAddRequest = {
    name?: string
    parentId?: number
  }

  type CategoryQueryRequest = {
    current?: number
    id?: number
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
    id?: number
    name?: string
    parentId?: number
    useNum?: number
  }

  type CategoryVO = {
    id?: number
    name?: string
    parentId?: number
    useNum?: number
  }

  type DeleteRequest = {
    id?: number
  }

  type getPictureDetailByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureInfoByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPicturePageListAsHomeUsingGETParams = {
    categoryId?: number
    current?: number
    endCreateTime?: string
    endEditTime?: string
    id?: number
    multipleSort?: boolean
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originWidth?: number
    pageSize?: number
    picDesc?: string
    picName?: string
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

  type getSpaceDetailByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceListAsUserUsingGETParams = {
    current?: number
    id?: number
    multipleSort?: boolean
    pageSize?: number
    'sort.asc'?: boolean
    'sort.field'?: string
    'sorts[0].asc'?: boolean
    'sorts[0].field'?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type getSpaceUserPageListBySpaceIdUsingGETParams = {
    current?: number
    id?: number
    multipleSort?: boolean
    pageSize?: number
    'sort.asc'?: boolean
    'sort.field'?: string
    'sorts[0].asc'?: boolean
    'sorts[0].field'?: string
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type getUserDetailByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserInfoByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type GrabPictureResult = {
    handleImageUrl?: string
    imageName?: string
    imageUrl?: string
  }

  type LoginUserVO = {
    birthday?: string
    createTime?: string
    id?: number
    inviteUserId?: number
    leftMenus?: string[]
    otherMenus?: string[]
    shareCode?: string
    token?: string
    topMenus?: string[]
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userName?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
    vipExpireTime?: string
    vipNumber?: number
    vipSign?: string
  }

  type PageVOCategory_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: Category[]
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

  type PageVOSpaceUserVO_ = {
    current?: number
    pageSize?: number
    pages?: number
    records?: SpaceUserVO[]
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

  type Picture = {
    categoryId?: number
    collectQuantity?: number
    compressFormat?: string
    compressPath?: string
    compressSize?: number
    createTime?: string
    downloadQuantity?: number
    editTime?: string
    id?: number
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
    resourceStatus?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerUser?: number
    shareQuantity?: number
    spaceId?: number
    tags?: string
    thumbnailPath?: string
    thumbnailUrl?: string
    updateTime?: string
    userId?: number
    viewQuantity?: number
  }

  type PictureBatchEditRequest = {
    categoryId?: number
    idList?: number[]
    inputTagList?: string[]
    nameRule?: string
    spaceId?: number
    tagList?: number[]
  }

  type PictureDetailVO = {
    categoryId?: number
    categoryName?: string
    collectQuantity?: number
    compressFormat?: string
    compressSize?: number
    createTime?: string
    downloadQuantity?: number
    id?: number
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
    id?: number
    picDesc?: string
    picName?: string
    spaceId?: number
    tags?: string[]
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
    id?: number
    isShare?: number
    likeQuantity?: number
    loginUserIsCollect?: boolean
    loginUserIsLike?: boolean
    picDesc?: string
    picName?: string
    picUrl?: string
    shareQuantity?: number
    tags?: string
    thumbnailUrl?: string
    userAvatar?: string
    userId?: number
    userName?: string
    viewQuantity?: number
  }

  type PictureInteractionRequest = {
    change?: number
    id?: number
    type?: number
  }

  type PictureQueryRequest = {
    categoryId?: number
    current?: number
    endCreateTime?: string
    endEditTime?: string
    id?: number
    multipleSort?: boolean
    originColor?: string
    originFormat?: string
    originHeight?: number
    originScale?: number
    originWidth?: number
    pageSize?: number
    picDesc?: string
    picName?: string
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
    id?: number
    idList?: number[]
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureUpdateRequest = {
    categoryId?: number
    id?: number
    picDesc?: string
    picName?: string
    spaceId?: number
    tags?: string[]
  }

  type PictureUploadRequest = {
    categoryId?: number
    id?: number
    picDesc?: string
    picName?: string
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
    id?: number
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

  type Sort = {
    asc?: boolean
    field?: string
  }

  type Space = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    updateTime?: string
    usedCount?: number
    usedSize?: number
    userId?: number
  }

  type SpaceActivateRequest = {
    spaceName?: string
  }

  type SpaceAddRequest = {
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type SpaceDetailVO = {
    createTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    maxSizeUnit?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    usedSizeUnit?: string
    userId?: number
  }

  type SpaceEditRequest = {
    id?: number
    spaceName?: string
  }

  type SpaceLevelVO = {
    key?: number
    label?: string
    maxCount?: number
    maxSize?: number
  }

  type SpaceQueryRequest = {
    current?: number
    id?: number
    multipleSort?: boolean
    pageSize?: number
    sort?: Sort
    sorts?: Sort[]
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  type SpaceUserAddRequest = {
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserEditRequest = {
    id?: number
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserVO = {
    createTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    user?: UserDetailVO
    userId?: number
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    maxSizeUnit?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    usedCount?: number
    usedSize?: number
    usedSizeUnit?: string
    userId?: number
    userInfo?: User
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadPictureByFileUsingPOSTParams = {
    categoryId?: number
    id?: number
    picDesc?: string
    picName?: string
    pictureUrl?: string
    spaceId?: number
    tags?: string[]
  }

  type User = {
    admin?: boolean
    birthday?: string
    createTime?: string
    editTime?: string
    id?: number
    inviteUserId?: number
    isDelete?: number
    isDisabled?: number
    shareCode?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
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

  type UserAddRequest = {
    birthday?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
    userName?: string
    userPhone?: string
    userProfile?: string
    userRole?: string
  }

  type UserDetailVO = {
    birthday?: string
    createTime?: string
    id?: number
    inviteUserId?: number
    isDisabled?: number
    shareCode?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
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
    id?: number
    shareCode?: string
    userAccount?: string
    userAvatar?: string
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
    id?: number
    inviteUserId?: number
    multipleSort?: boolean
    pageSize?: number
    shareCode?: string
    sort?: Sort
    sorts?: Sort[]
    userAccount?: string
    userEmail?: string
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
    id?: number
    inviteUserId?: number
    isDisabled?: number
    shareCode?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
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
    id?: number
    inviteUserId?: number
    isDelete?: number
    isDisabled?: number
    shareCode?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userEmail?: string
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
