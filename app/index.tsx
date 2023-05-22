import { View, Text, TouchableOpacity } from 'react-native'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

import SpaceTimesLogo from '../src/assets/space-times-logo.svg'
import { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router'

WebBrowser.maybeCompleteAuthSession()

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/9546e9c5aa45372e1b7f',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: '9546e9c5aa45372e1b7f',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetimes',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
      platform: 'mobile',
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <SpaceTimesLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center text-base font-bold leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGitHub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
