import { TestBed } from '@angular/core/testing';

import { CognitoService } from './cognito.service';

describe('CognitoService', () => {
  let service: CognitoService;

  const jwtToker = `eyJraWQiOiJxdWxRc2RFWmw2ckZydGdCajExY0NLRktkdU
  UzVjRjWGRlS0N0TzBnbTJ3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNDkwZmU
  wNS1lYTFiLTQwYWUtYWM0ZS05MDFiMWRmYzY5ZTUiLCJ6b25laW5mbyI6IjJjYmJmZ
  DBhLTBmZjctNDA2Mi04OWRhLWJmMmZhNjM4MDdiNyIsImN1c3RvbTpmZWRVc2VyUm9sZ
  SI6InRlbmFudF9yZWFkb25seSIsImN1c3RvbTp1c2VyTmFtZSI6ImFsZXhjYW5kcmV3c
  zkxK2V0cy11c2VyQGdtYWlsLmNvbSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5
  1cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1ROcnlQdjlkUSIsImN1c3Rvb
  phc3NpZ25lZFJvbGUiOiJjc28tc3VwZXJ2aXNvciIsImN1c3RvbTp0ZW5hbnRJZCI6IjJ
  jYmJmZDBhLTBmZjctNDA2Mi04OWRhLWJmMmZhNjM4MDdiNyIsImN1c3RvbTp1c2VyUm9s
  ZSI6IkVORF9VU0VSIiwiY3VzdG9tOmxhc3RNb2RpZmllZFRpbWUiOiIxNTk2MDYxNjI1O
  TY3IiwiYXV0aF90aW1lIjoxNjAzMTc1NTMwLCJleHAiOjE2MDMxNzkxMzAsImlhdCI6MT
  YwMzE3NTUzMCwiZW1haWwiOiJhbGV4Y2FuZHJld3M5MStldHMtdXNlckBnbWFpbC5jb20i
  LCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiY3VzdG9tOmludGVybmFsVXNlciI6IjAi
  LCJjdXN0b206bGFzdE5hbWUiOiJBbmRyZXdzIiwiY3VzdG9tOnJvbGVJbmZvcm1
  hdGlvbiI6InRlbmFudF9yZWFkb25seSIsImNvZ25pdG86dXNlcm5hbWUiOiJjNDkwZm
  UwNS1lYTFiLTQwYWUtYWM0ZS05MDFiMWRmYzY5ZTUiLCJjdXN0b206dXNlcklkIjoiN
  TZhMTUxZjEtMTY2MS00ZjM1LWJlN2MtMTA2Yjk1MzQ1NDUyIiwiYXVkIjoiZ2x2aGcwaHF
  ocXFiZGZ1YXJ2ZnN1ZzRydCIsImN1c3RvbTpjcmVhdGVkVGltZSI6IjE1ODg4NzI3OTMxOD
  giLCJldmVudF9pZCI6ImQxZDZiZjdkLTg0NmUtNDM2OS1iY2MwLTI5ZGQxMzc5MzAwNCIsIm
  N1c3RvbTpmaXJzdE5hbWUiOiJBbGV4IiwidG9rZW5fdXNlIjoiaWQiLCJjdXN0b206YWRkcmV
  zc0xpbmUxIjoiMTU1MjAgRWxsZXJzbGllIFJkIFNXLCBFZG1vbnRvbiwgQUIgVDZXIDFBNCwgQ
  2FuYWRhIiwiY3VzdG9tOmFkZHJlc3NJZCI6IjU5YTRkZjYwLWMyOTQtNGE5OS1hMWZhLTRkMGQy
  YzlhNThhZiJ9.FJZVyfaCKubnOZDBLFY_PsV7YU2UYKBTGzEKyTYokSosLgZ4hcus6Il4d7uPA0W
  ctAJh_XdzgYX1UIgL6mdgWCRMBdjepDybMobR5ia0FCB21FsrpOqLmTYHtp60PmME1wnebYR27Wo
  a5VAWSchq7FRr5bDTN7LWA9kAbEpY8KvysV6SwGVGfZNRarXS2PG7YcYnUV5lR7usHOuWDkQ4ahI
  otX0nrPQMWYYjuRKs7StDHdPoheqsh9lIE3mrsbjmY4BnCyCSo1YiEpFEjXgjw3ZoLEdF4XlB5h
  CuEvRwr6D9sLbBDZjTKQvTmZUnzczOIC9KEXvBmc9V6ED10vczQgeyJraWQiOiJxdWxRc2RFWmw2c
  kZydGdCajExY0NLRktkdUUzVjRjWGRlS0N0TzBnbTJ3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJ
  jNDkwZmUwNS1lYTFiLTQwYWUtYWM0ZS05MDFiMWRmYzY5ZTUiLCJ6b25laW5mbyI6IjJjYmJmZDBhL
  TBmZjctNDA2Mi04OWRhLWJmMmZhNjM4MDdiNyIsImN1c3RvbTpmZWRVc2VyUm9sZSI6InRlbmFudF9yZ
  WFkb25seSIsImN1c3RvbTp1c2VyTmFtZSI6ImFsZXhjYW5kcmV3czkxK2V0cy11c2VyQGdtYWlsLmNvb
  SIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZW
  FzdC0xX1ROcnlQdjlkUSIsImN1c3RvbTphc3NpZ25lZFJvbGUiOiJjc28tc3VwZXJ2aXNvciIsImN1c3R
  vbTp0ZW5hbnRJZCI6IjJjYmJmZDBhLTBmZjctNDA2Mi04OWRhLWJmMmZhNjM4MDdiNyIsImN1c3RvbTp1
  c2VyUm9sZSI6IkVORF9VU0VSIiwiY3VzdG9tOmxhc3RNb2RpZmllZFRpbWUiOiIxNTk2MDYxNjI1OTY3Iiw
  iYXV0aF90aW1lIjoxNjAzMTc1NTMwLCJleHAiOjE2MDMxNzkxMzAsImlhdCI6MTYwMzE3NTUzMCwiZW1haW
  wiOiJhbGV4Y2FuZHJld3M5MStldHMtdXNlckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwi
  Y3VzdG9tOmludGVybmFsVXNlciI6IjAiLCJjdXN0b206bGFzdE5hbWUiOiJBbmRyZXdzIiwiY3VzdG9tOnJvb
  GVJbmZvcm1hdGlvbiI6InRlbmFudF9yZWFkb25seSIsImNvZ25pdG86dXNlcm5hbWUiOiJjNDkwZmUwNS1l
  YTFiLTQwYWUtYWM0ZS05MDFiMWRmYzY5ZTUiLCJjdXN0b206dXNlcklkIjoiNTZhMTUxZjEtMTY2MS00ZjM1
  LWJlN2MtMTA2Yjk1MzQ1NDUyIiwiYXVkIjoiZ2x2aGcwaHFocXFiZGZ1YXJ2ZnN1ZzRydCIsImN1c3RvbTp
  jcmVhdGVkVGltZSI6IjE1ODg4NzI3OTMxODgiLCJldmVudF9pZCI6ImQxZDZiZjdkLTg0NmUtNDM2OS1iY2
  MwLTI5ZGQxMzc5MzAwNCIsImN1c3RvbTpmaXJzdE5hbWUiOiJBbGV4IiwidG9rZW5fdXNlIjoiaWQiLCJjd
  XN0b206YWRkcmVzc0xpbmUxIjoiMTU1MjAgRWxsZXJzbGllIFJkIFNXLCBFZG1vbnRvbiwgQUIgVDZXIDFB
  NCwgQ2FuYWRhIiwiY3VzdG9tOmFkZHJlc3NJZCI6IjU5YTRkZjYwLWMyOTQtNGE5OS1hMWZhLTRkMGQyYzlh
  NThhZiJ9.FJZVyfaCKubnOZDBLFY_PsV7YU2UYKBTGzEKyTYokSosLgZ4hcus6Il4d7uPA0WctAJh_XdzgY
  1UIgL6mdgWCRMBdjepDybMobR5ia0FCB21FsrpOqLmTYHtp60PmME1wnebYR27Woa5VAWSchq7FRr5bDTN7LWA
  9kAbEpY8KvysV6SwGVGfZNRarXS2PG7YcYnUV5lR7usHOuWDkQ4ahIotX0nrPQMWYYjuRKs7StDHdPoheqsh9l
  IE3mrsbjmY4BnCyCSo1YiEpFEjXgjw3ZoLEdF4XlB5hCuEvRwr6D9sLbBDZjTKQvTmZUnzczOIC9KEXvBmc9V6ED10vczQg`;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call buildCognitoCreds() with jwt token', () => {
    spyOn(service, 'buildCognitoCreds').and.callThrough();
    service.buildCognitoCreds(jwtToker);
    expect(service.buildCognitoCreds).toHaveBeenCalled();
  });

  it('should call getTokenAfterExpiredAndRefresh()', () => {
    spyOn(service, 'getTokenAfterExpiredAndRefresh').and.callThrough();
    service.getTokenAfterExpiredAndRefresh();
    expect(service.getTokenAfterExpiredAndRefresh).toHaveBeenCalled();
  });

  it('should call checkTokenExpiryAndGetToken()', () => {
    spyOn(service, 'checkTokenExpiryAndGetToken').and.callThrough();
    service.checkTokenExpiryAndGetToken();
    expect(service.checkTokenExpiryAndGetToken).toHaveBeenCalled();
  });

  it('should call getIdTokenByRefreshToken()', () => {
    spyOn(service, 'getIdTokenByRefreshToken').and.callThrough();
    service.getIdTokenByRefreshToken();
    expect(service.getIdTokenByRefreshToken).toHaveBeenCalled();
  });
});
